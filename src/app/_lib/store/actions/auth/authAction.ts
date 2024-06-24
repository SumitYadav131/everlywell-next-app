import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from '@/app/_lib/axios';

export const loginUser = createAsyncThunk('signupUser',async(data:any)=>{
    const result = axios.post('api/auth/login', data);
    return result;
})