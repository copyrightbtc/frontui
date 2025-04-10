export const toQueryString = (obj: { [key: string]: any } | null | undefined, splitArray?: boolean) => {
    if (!obj) return "";
  
    const params = new URLSearchParams();
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        if (splitArray && Array.isArray(obj[key]) && obj[key].length > 1) {
          obj[key].forEach((value: string) => {
            params.append(key, value);
          });
        } else {
          params.append(key, obj[key]);
        }
      }
    }
  
    return params.toString().length ? `?${params.toString()}` : "";
  };