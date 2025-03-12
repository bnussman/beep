import Holidays from 'date-holidays';

export default function beeperIcon() {
    const hd = new Holidays('US');
    const today = new Date()

    const holiday = hd.isHoliday(today);

    if (holiday) {
        switch (holiday[0].name) {
            case "New Year's Day":
                return "🎉";
            case "Valentine's Day":
                const valentinesEmojis = ["❤️", "🥰", "💌"];
                return valentinesEmojis[Math.floor(Math.random() * valentinesEmojis.length)];
            case "St. Patrick's Day":
                return "🍀";
            case "Halloween":
                const halloweenEmojis = ["🎃", "🧟", "👻"];
                return halloweenEmojis[Math.floor(Math.random() * halloweenEmojis.length)];
            case "Thanksgiving Day":
                return "🦃";
            default:
                return "🚕";
        }
    }
    return "🚕";
}