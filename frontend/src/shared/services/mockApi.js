import {doctors} from '../data';
const wait=value=>new Promise(resolve=>setTimeout(()=>resolve(value),120));
export const fetchDoctors=()=>wait(doctors);
export const fetchAppointments=()=>wait([{id:1,doctor:'Dr. Maya Patel',date:'Today, 4:30 PM',type:'Video visit',status:'Confirmed'}]);
export const fetchAdminRecords=section=>wait(section==='Doctors'?doctors:[{id:1,name:'Alex Smith',status:'Active'}]);
