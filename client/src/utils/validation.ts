export const isValidEmail = (email: string) => {
    return true;
};

export const isValidPassword = (password: string) => {
    return password.length >= 6 && password.length <= 25;
}