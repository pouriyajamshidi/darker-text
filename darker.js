const textColor = "#ccc"
const ytTextPrimary = "--yt-spec-text-primary"

try {
    document.documentElement.style.getPropertyValue(ytTextPrimary);
    console.log("[+] Darker Text: Successfully changed YouTube text color to:", textColor)
} catch (error) {
    console.log("[-] Darker Text: Failed to change YouTube text color to:", textColor)
    console.log(error)
}
