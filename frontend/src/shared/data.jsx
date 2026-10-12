import React,{useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
export const doctors=[
 {id:1,name:'Dr. Maya Patel',specialty:'Family Medicine',rating:4.9,exp:'12 years',fee:'$45',color:'#cfe3bc',initials:'MP',next:'Today, 4:30 PM',bio:'Warm, whole-person care for every stage of life.'},
 {id:2,name:'Dr. Jordan Lee',specialty:'Dermatology',rating:4.8,exp:'9 years',fee:'$55',color:'#f1d9b8',initials:'JL',next:'Tomorrow, 10:00 AM',bio:'Evidence-led skin care with a gentle approach.'},
 {id:3,name:'Dr. Aisha Khan',specialty:'Pediatrics',rating:5.0,exp:'15 years',fee:'$40',color:'#d9d1ec',initials:'AK',next:'Fri, 9:00 AM',bio:'Making visits easy for little ones and their families.'},
 {id:4,name:'Dr. Theo Williams',specialty:'Cardiology',rating:4.7,exp:'18 years',fee:'$70',color:'#c2dfe1',initials:'TW',next:'Mon, 2:00 PM',bio:'Clear, collaborative heart health guidance.'}
];
export const navByRole={patient:[['/patient','⌂','Overview'],['/doctors','⌕','Find a doctor'],['/appointments','▣','Appointments'],['/notifications','♢','Notifications'],['/symptoms','✦','Symptom checker']],doctor:[['/doctor','⌂','Overview'],['/doctor/queue','≡','Queue'],['/doctor/schedule','▦','Schedule'],['/doctor/availability','◷','Availability'],['/doctor/history','♙','Patient history']],admin:[['/admin','⌂','Overview'],['/admin/doctors','⚕','Doctors'],['/admin/patients','♙','Patients'],['/admin/staff','♧','Staff'],['/admin/branches','⌖','Branches'],['/admin/calendar','▦','Master calendar'],['/admin/booking','＋','Manual booking'],['/admin/queue','≡','Queue management'],['/admin/configuration','⚙','Configuration'],['/admin/reports','▥','Reports'],['/admin/audit','◌','Audit log']]};
