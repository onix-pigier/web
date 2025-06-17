import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

// Interface pour typer la réponse d'erreur de l'API
interface ApiErrorResponse {
  message?: string;
}

// Fonction pour afficher les erreurs Axios avec react-hot-toast
const AxiosToastError = (error: AxiosError<ApiErrorResponse>) => {
  toast.error(
    error.response?.data?.message || error.message || "Une erreur est survenue"
  );
};

export default AxiosToastError;
