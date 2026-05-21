import { useLocation } from "react-router-dom";

const useParams = (string) => {
    const location = useLocation();
   
    const params = new URLSearchParams(location.search);
    
    return params.get(string);
}

export { useParams }