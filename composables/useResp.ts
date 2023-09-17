export default function useResp() {
  const state = reactive<{
    res?:object
  }>({
    res:{}
  })
  
type method = 'POST'|'GET'|'PUT'|'DELETE';
interface IErr {
  msg: String;
}


  const fetchData = async({
    url ='https://chefcito-back-production.up.railway.app/',
    path ='',
    method = 'GET',
    headers = {},
    body = {}
  }:{
    url?:string,
    path?:string,
    method:method
    headers:object
    body:object })=> {
    const response = await fetch(url+path,
      {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body)
    })
    .then((data) => data.json())
    .catch(err => err as IErr)

    state.res = response
    return response
  }

  return {
    res: state.res,
    fetchData
  }
}