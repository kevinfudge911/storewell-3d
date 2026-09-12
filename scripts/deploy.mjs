// Preserve the owner's custom models from the August deployment in every release.
// Wrangler uploads local files and compiles Pages Functions into a preview first.
// Only the final manifest containing all retained assets can reach production.
import fs from 'node:fs';
import { unstable_pages } from 'wrangler';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const branch = process.argv[2] || 'main';
const projectName = 'storewell-3d';
const apiRoot = 'https://api.cloudflare.com/client/v4';
const projectPath = `/accounts/${accountId}/pages/projects/${projectName}`;
const recovered = JSON.parse(fs.readFileSync(new URL('./recovered-assets.json', import.meta.url), 'utf8'));
if (!accountId || !token) throw new Error('Existing Cloudflare account and token environment variables are required.');

async function api(path, options = {}, bearer = token) {
  const response = await fetch(apiRoot + path, {
    signal: AbortSignal.timeout(60000),
    ...options, headers: { Authorization: `Bearer ${bearer}`, ...options.headers },
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    // Full deployment responses contain runtime secrets; never log them.
    throw new Error(`Cloudflare ${response.status}: ${(result.errors || []).map(e => `${e.code}: ${e.message}`).join('; ')}`);
  }
  return result.result;
}
async function waitForDeployment(id) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const deployment = await api(`${projectPath}/deployments/${id}`);
    const stage = deployment.latest_stage;
    if (stage?.status === 'failure' || stage?.status === 'canceled') throw new Error(`Deployment ${id} ${stage.status}.`);
    if (stage?.name === 'deploy' && stage.status === 'success') return deployment;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  throw new Error(`Deployment ${id} did not finish in three minutes.`);
}

const source = await api(`${projectPath}/deployments/${recovered.sourceDeployment}`);
for (const [path, hash] of Object.entries(recovered.files)) {
  if (source.files?.[path] !== hash) throw new Error(`Retained model provenance does not match: ${path}`);
}
const { jwt } = await api(`${projectPath}/upload-token`);
const missing = await api('/pages/assets/check-missing', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hashes: Object.values(recovered.files) }),
}, jwt);
if (missing.length) throw new Error('Retained custom character assets are unavailable. Production has not changed.');
await api('/pages/assets/upsert-hashes', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hashes: Object.values(recovered.files) }),
}, jwt);
console.log('Verified all retained custom character assets.');

const { formData } = await unstable_pages.deploy({
  directory: 'public', accountId, projectName, branch: 'storewell-asset-staging',
  commitHash: process.env.GITHUB_SHA,
  commitMessage: 'Recover the upgraded StoreWell exterior and characters',
  commitDirty: false, functionsDirectory: 'functions', sourceMaps: false,
});
const manifest = JSON.parse(formData.get('manifest'));
for (const [path, hash] of Object.entries(recovered.files)) manifest[path] ??= hash;
const publish = new FormData();
for (const [key, value] of formData.entries()) publish.append(key, value);
publish.set('manifest', JSON.stringify(manifest));
publish.set('branch', branch);
if (!publish.has('_worker.bundle')) throw new Error('Pages Functions were not compiled; refusing to deploy.');
const submitted = await api(`${projectPath}/deployments`, { method: 'POST', body: publish });
console.log(`Submitted ${branch}: ${submitted.url}`);
const deployment = await waitForDeployment(submitted.id);
for (const path of Object.keys(recovered.files)) {
  if (deployment.files?.[path] !== manifest[path]) throw new Error(`Deployed asset missing: ${path}`);
}
console.log(JSON.stringify({ id: deployment.id, url: deployment.url, environment: deployment.environment, status: 'success', customAssets: Object.keys(recovered.files) }));
