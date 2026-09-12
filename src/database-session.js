// A remembered staff login and Firebase's restored connection become ready separately.
export function createDatabaseSession({auth,signInAnonymously,db,ref,push,update,isOnline=()=>navigator.onLine!==false}) {
  let connecting;
  async function ensureAuth(refresh=false) {
    if(!connecting){
      connecting=(async()=>{
        await auth.authStateReady();
        return auth.currentUser||(await signInAnonymously(auth)).user;
      })().finally(()=>{connecting=null;});
    }
    const user=await connecting;
    if(refresh)await user.getIdToken(true);
    return user;
  }
  async function saveChange(unit,status,entry){
    if(!isOnline())throw Object.assign(new Error('StoreWell is offline'),{code:'database/offline'});
    await ensureAuth();
    if(!isOnline())throw Object.assign(new Error('StoreWell is offline'),{code:'database/offline'});
    const key=push(ref(db,'lockLog')).key;
    const changes={['lockOverrides/'+unit]:status,['lockLog/'+key]:entry};
    try{await update(ref(db),changes);}
    catch(error){
      if(!/permission.?denied|expired.?token/i.test(String(error.code||error.message)))throw error;
      // Refresh the same saved database session once, retaining the same history key.
      await ensureAuth(true);await update(ref(db),changes);
    }
    return key;
  }
  return {ensureAuth,saveChange};
}
