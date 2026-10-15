import {useQuery} from '@tanstack/react-query';
import {fetchDoctors,fetchAppointments,fetchAdminRecords} from '../services/mockApi';
export const useDoctors=()=>useQuery({queryKey:['doctors'],queryFn:fetchDoctors});
export const useAppointments=()=>useQuery({queryKey:['appointments'],queryFn:fetchAppointments});
export const useAdminRecords=section=>useQuery({queryKey:['admin-records',section],queryFn:()=>fetchAdminRecords(section)});
