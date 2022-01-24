const textColor = "#ccc"
const ytTextPrimary = "--yt-spec-text-primary"

try {
    document.documentElement.style.setProperty(ytTextPrimary, textColor);
    console.log("[+] Darker Text: Successfully changed YouTube text color")
} catch (error) {
    console.log("[-] Darker Text: Failed to change YouTube text color")
    console.log(error)
}
