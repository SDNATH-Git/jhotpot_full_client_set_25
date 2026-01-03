import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: `https://zap-shift-server-psi.vercel.app`
    baseURL: `https://jhotpot-full-server-set-25.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;



