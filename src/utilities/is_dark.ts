const darkmode_switch = (is_dark: boolean) => {
    if (is_dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export default darkmode_switch