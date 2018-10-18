// Function that encapsulates record,stop and play functionalities.
// Resolves into start and stop.
const recordAudio = () =>
    new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () =>
            new Promise(resolve => {
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
            });

        resolve({ start, stop });
    });

// Global variables
let recorder;
let audio;

// Function that is invoked when record button is pressed in UI.
startRecording = async () => {
    recorder = await recordAudio();
    recorder.start();
};

// Function that is invoked when stop button is pressed in UI.
stopRecording = async () => {
    audio = await recorder.stop();
};

// Function that is invoked when play button is pressed in UI.
playRecording = async () => {
    audio.play();
};