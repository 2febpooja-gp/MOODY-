const SUPABASE_URL =
"https://hpgnwdyzqwiilicaebiz.supabase.co";

const SUPABASE_KEY =
"sb_publishable_cDhOldcrkpj_khGL4N6Cfg_-AAJJE_T";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const currentUser =
localStorage.getItem("currentUser");

let allUsers = [];


function showUsers(users){

    const chatList =
    document.getElementById("chatList");

    chatList.innerHTML = "";

    users.forEach(user => {

        if(user.username === currentUser){
            return;
        }

        chatList.innerHTML += `
        <div class="chat-item"
        onclick="openChat('${user.username}')">

            <img src="defaultprofile.png"
            class="chat-pfp">

            <div class="chat-info">

                <h3>${user.username}</h3>

                <p>Start chatting...</p>

            </div>

            <span class="chat-time">→</span>

        </div>
        `;

    });

}



async function loadUsers() {

    const { data, error } = await supabaseClient
    .from("users")
    .select("*");

    console.log(data);
    console.log(error);

    allUsers = data;

    showUsers(allUsers);

    
}



loadUsers();

const searchUser = 
document.getElementById("searchUser");

searchUser.addEventListener("input", () => {

    const searchText = 
    searchUser.value.toLowerCase();

    const filteredUsers = 
    allUsers.filter(user =>

        user.username
        .toLowerCase()
        .includes(searchText)
    );

    showUsers(filteredUsers);
});

function openChat(username){

    window.location.href =
    "chat.html?user=" +
    encodeURIComponent(username);
}
