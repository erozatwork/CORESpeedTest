import { useState, useEffect } from "react";

// // ----------------------------------------------------------------------
// export default function useOffSetTop(ref, top = 100) {
//     const [value, setValue] = useState(false);
    
  
//     useEffect(() => {
//         const element = ref.current;
//         if (!element) return;
    
//         const handleScroll = () => {
//             setValue(element.scrollTop > top);
//         };
    
//         element.addEventListener("scroll", handleScroll);
//         handleScroll();
    
//         return () => {
//             element.removeEventListener("scroll", handleScroll);
//         };
//     }, [ref, top]);
    
//     return value;
// }


export default function useOffSetTop(top = 100) {
    const [value, setValue] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > top) {
                setValue(true);
            } else {
                setValue(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [top]);

    return value;
}


 // better performance [Long Pages], use debounce or throttle handleScroll using lodash or a small util function