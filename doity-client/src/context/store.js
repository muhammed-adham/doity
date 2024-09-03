import { create } from "zustand";

const userStore= create((set)=>({
    userName: null,
    setUserName: (data)=> set({userName:data}),
}))

export default userStore