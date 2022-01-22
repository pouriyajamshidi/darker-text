// var currentSite = window.location.hostname;

// if (currentSite == "www.youtube.com") {
//     try {
//         document.documentElement.style.setProperty('--yt-spec-text-primary', '#ccc');
//     } catch (error) {
//         console.log(error)
//     }
// }

try {
    document.documentElement.style.setProperty('--yt-spec-text-primary', '#ccc');
    console.log("Successfully changed YouTube text color")
} catch (error) {
    console.log(error)
}
