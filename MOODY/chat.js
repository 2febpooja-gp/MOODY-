const SUPABASE_URL =
"https://hpgnwdyzqwiilicaebiz.supabase.co";

const SUPABASE_KEY =
"sb_publishable_cDhOldcrkpj_khGL4N6Cfg_-AAJJE_T";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const params =
new URLSearchParams(window.location.search);

const username =
params.get("user");


const chatUsername =
document.getElementById("chatUsername");

chatUsername.textContent =
username;


// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage() {

    const input =
    document.getElementById("messageInput");

    const messageText =
    input.value.trim();

    if (!messageText) {
        return;
    }


    const receiver =
    username;

    const sender =
    localStorage.getItem("currentUser");


    const { data, error } =
    await supabaseClient
    .from("messages")
    .insert([
        {
            sender: sender,
            receiver: receiver,
            message: messageText
        }
    ])
    .select();


    console.log("Message data:", data);
    console.log("Message error:", error);


    if (error) {
        alert("Message could not be send due to Bad network");
        return;
    }


    input.value = "";

    // Message send hone ke baad chat reload
    loadMessages();

}


// ===============================
// LOAD MESSAGES
// ===============================

async function loadMessages() {

    const currentUser =
    localStorage.getItem("currentUser");

    const otherUser =
    username;

    console.log("Current user:", currentUser);
    console.log("Chat with:", otherUser);


    const { data, error } =
    await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", {
        ascending: true
    });


    console.log("ALL MESSAGES:", data);
    console.log("LOAD ERROR:", error);


    if (error) {
        console.log("Messages load error:", error);
        return;
    }


    const container =
    document.getElementById("messagesContainer");

    container.innerHTML = "";


    // Sirf current conversation ke messages
    const chatMessages =
    data.filter(function(msg) {

        return (
            (msg.sender === currentUser &&
             msg.receiver === otherUser)

            ||

            (msg.sender === otherUser &&
             msg.receiver === currentUser)
        );

    });


    console.log("CHAT MESSAGES:", chatMessages);


    chatMessages.forEach(function(msg) {

        const messageDiv =
        document.createElement("div");


        messageDiv.textContent =
        msg.message;


        messageDiv.style.padding =
        "10px 14px";

        messageDiv.style.marginBottom =
        "8px";

        messageDiv.style.borderRadius =
        "18px";

        messageDiv.style.maxWidth =
        "70%";


        if (msg.sender === currentUser) {

            messageDiv.style.marginLeft =
            "auto";

            messageDiv.style.background =
            "#d9fdd3";

        } else {

            messageDiv.style.marginRight =
            "auto";

            messageDiv.style.background =
            "white";

        }


        container.appendChild(messageDiv);

    });


    container.scrollTop =
    container.scrollHeight;

}


// ===============================
// INITIAL LOAD
// ===============================

loadMessages();