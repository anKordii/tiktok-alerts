export default async function getAvatar(name){
    const res = await fetch("/api/avatar?avatar="+name);
    let data = await res.json();
    if (res.status !== 200) {
        return "/avatar.png";
    }
    return data.avatar;
}