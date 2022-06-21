export function showToast(text: string, isError: boolean) {
    if (isError) {
        alert(text)
    }
}
