export const  getAllAdmins=  async ()=>{
    fetch('http://localhost:3001/api/admin/admins/all')
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.error(error))
}
