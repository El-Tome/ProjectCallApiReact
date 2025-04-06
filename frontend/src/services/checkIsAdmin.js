import { jwtDecode } from 'jwt-decode';

export default function isAdmin() {
    try {
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem('jwt');

        // Vérifier si le token existe
        if (!token) {
            return false;
        }

        // Décodage du token
        const decodedToken = jwtDecode(token);

        // Vérification du rôle admin
        const isAdmin = decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN');

        return isAdmin;
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return false;
    }
}
