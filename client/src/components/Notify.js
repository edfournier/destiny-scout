export function Notify() {
    async function handleClick() {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
            new Notification("Hello!");
        }
    }

    return (
        <button onClick={handleClick}>Enable notifications</button>
    );
}