import { useState } from "react";
import axios from "@shared/utils/axios";

import { GETSESSION } from "@features/auth/utils";

const useFormContainer = () => {
  const [container, insertIntoContainer] = useState([]);

  const fetch = async (url) => {
    const { data: result } = await axios.get(url, {
      headers: {
        authorization: GETSESSION(),
      },
    });

    insertIntoContainer(result);
  };
  const resetContainer = () => insertIntoContainer([]);

  return { container, fetch, resetContainer };
};

export { useFormContainer };
