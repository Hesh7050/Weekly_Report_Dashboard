export const formatDate = (dateValue) => {
    if (!dateValue) return "-";
  
    const date = new Date(dateValue);
  
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  export const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
  
    const date = new Date(dateValue);
  
    return date.toISOString().split("T")[0];
  };