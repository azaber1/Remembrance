
chrome.alarms.get('myAlarm', function (alarm) {
    if (alarm == null) {
        chrome.alarms.create('myAlarm', { periodInMinutes: 60 });
    }
});

var athkarOne = {
    type: 'basic',
    title: ' Light on the tongue, heavy on the scales',
    message: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    requireInteraction: true,
    iconUrl: 'icon48.png'

};
var athkarTwo = {
    type: 'basic',
    title: 'A solution for all your worries',
    message: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ',
    requireInteraction: true,
    iconUrl: 'icon48.png'

};

var athkarThree = {
    type: 'basic',
    title: 'Say this once to be blessed ten times',
    message: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَّبينا مُحَمَّد',
    requireInteraction: true,
    iconUrl: 'icon48.png'

};

var athkarFour = {
    type: 'basic',
    title: 'The most beloved words to Allah (swt)',
    message: 'سُبْحَانَ اللَّهِ وَ الْحَمْدُ لِلَّهِ وَ لاَ اِلهَ إِلاَّ اللَّهُ وَ اللَّهُ أَكْبَرُ',
    requireInteraction: true,
    iconUrl: 'icon48.png'

};

var athkarFive = {
    type: 'basic',
    title: 'A palm tree planted for you in Paradise',
    message: 'سُبْحَانَ اللهِ الْعَظِيمِ وَبِحَمْدِهِ',
    requireInteraction: true,
    iconUrl: 'icon48.png'

};
var myarr = [athkarOne, athkarTwo, athkarThree, athkarFour, athkarFive];

i = 0;


chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.storage.local.get('enabled', function (result) {
        if (result.enabled) {


            if (alarm.name == "myAlarm") {

                if (i == 5) {
                    i = 0;
                }
                chrome.notifications.create('newnotif', myarr[i++]);
            }


            // chrome.notifications.create('limitNotif', athkarOne);
        }
    });
});




// chrome.storage.local.get('enabled', data => {
//     if (result.key == 'enabled') {
//         var athkarOne = {
//             type: 'basic',
//             title: ' Light on the tongue, heavy on the scales',
//             message: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
//             requireInteraction: true,
//             iconUrl: 'icon48.png'

//         };




//         var myarr = [athkarOne, athkarTwo, athkarThree, athkarFour, athkarFive];



//         chrome.notifications.create('limitNotif', athkarOne);

//         i = 0;

//         chrome.alarms.create("5min", {
//             delayInMinutes: 1,
//             periodInMinutes: 1
//         });

//         chrome.alarms.onAlarm.addListener(function (alarm) {

//             if (alarm.name === "5min") {

//                 if (i == 5) {
//                     i = 0;
//                 }
//                 chrome.notifications.create('newnotif', myarr[i++]);

//             }
//         });





//     } else {
//         //it is disabled
//     }
// });

