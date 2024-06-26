//Function returns userRole stored in browser 
export function getUserRole(): string | null {
    try {
        return window.localStorage.getItem('userRole');
    } catch (e) {
        return null;
    }
}
