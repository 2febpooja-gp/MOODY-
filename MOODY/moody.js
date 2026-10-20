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

const profileName = 
document.getElementById("profileName");

if(currentUser){

    profileName.textContent =
    currentUser;
}

const addMood = 
document.getElementById("addMood");
const popup = 
document.getElementById("moodPopup");
const feed = 
document.getElementById("feed");
const profileBtn = 
document.getElementById("profileBtn");
const homeBtn = 
document.getElementById("homeBtn");
const profilePage = 
document.getElementById("profilePage");
const postCount = 
document.getElementById("postCount");
const myPosts = 
document.getElementById("myPosts");
const menuPopup = 
document.getElementById("menuPopup");
const deletePostBtn = 
document.getElementById("deletePostBtn");
const editPostBtn = 
document.getElementById("editPostBtn");
const deletePopup = 
document.getElementById("deletePopup");
const cancelDelete = 
document.getElementById("cancelDelete");
const confirmDelete = 
document.getElementById("confirmDelete");
const photoBox = 
document.getElementById("photoBox");
const photoInput = 
document.getElementById("photoInput");

let selectedPostIndex = null;

let isEditing = false;

let selectedImage = "";

let selectedType = "";

addMood.addEventListener("click", () => {

    postBtn.innerText = "Post";

    isEditing = false;

    selectedImage = "";
    selectedType = "";

    document.getElementById("moodInput").value = "";
    document.getElementById("captionInput").value = "";
    document.getElementById("emojiInput").value = "";

    photoBox.innerHTML = "📷 Add Photo";

    photoBox.style.pointerEvents = "auto";
    photoBox.style.opacity = "1";

    popup.style.display = "flex";

});



const postBtn = 
document.getElementById("postBtn");

const closePopup = 
document.getElementById("closePopup");

closePopup.addEventListener("click" , () => {

    popup.style.display = "none";

    if (!isEditing) {

        selectedImage = "";
        selectedType = "";

        photoBox.innerHTML = "📷 Add Photo";
    }

    photoBox.style.pointerEvents = "auto";
    photoBox.style.opacity = "1";

});

function setupLikeButtons() {
    const likeBtns = 
    document.querySelectorAll(".like-btn");


    likeBtns.forEach(btn => {

    btn.onclick = async function() {

        const index =
        this.dataset.index;
        const postId = this.dataset.postid;

        console.log("Post ID:",postId);
        
        const {data, error } = await
        supabaseClient
        .from("moody")
        .select("likes")
        .eq("id", postId)
        .single();

        console.log("Likes:", data.likes);
        const newLikes = data.likes + 1;
        const { error: UpdateError } = await supabaseClient
        .from("moody")
        .update({
            likes: newLikes
        })
        .eq("id", postId);
        console.log("UpdateError:", UpdateError);

        

        let posts = 
        JSON.parse(
            localStorage.getItem("posts")
        ) || [];

        let count = 
        this.querySelector(".like-count");

        if(this.classList.contains("liked"))
        {
            posts[index].likes = 0;
            count.innerText = 0;
            this.classList.remove("liked");

        } else {

            posts[index].likes = 1;
            count.innerText = 1;
            this.classList.add("liked");
        }

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );

    };

        
});

}







postBtn.onclick = async function() {

    postBtn.disabled = true;


    const emoji = 
    document.getElementById("emojiInput").value;

    console.log("EMOJI:", emoji);

    const mood = 
    document.getElementById("moodInput").value;

    
    const caption = 
    document.getElementById("captionInput").value;
    
    const time = new
    Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    
    });


    const feed = 
    document.getElementById("feed");

    let posts = 
    JSON.parse(localStorage.getItem("posts"))
    || [];

    feed.innerHTML = `
    <div class="mood-card">
    <div class="mood-image">${emoji}</div>
    <h3>${mood}</h3>
    <p class="caption">
    ${caption}
    </p>

    <p class="time">${time}</p>

    <div class="action-row">

    <div class="post-actions like-btn">
    ❤️ <span class="like-count">0</span> Likes
    </div>

    <div class="post-actions comments-btn"
    data-index="0">
    💬 comments
    </div>
    </div>
    

    
    ` + feed.innerHTML;

    if (isEditing) {

        posts[selectedPostIndex].mood = mood;
        posts[selectedPostIndex].caption = caption;
        
        isEditing = false;

        photoBox.style.pointerEvents = "auto";
        photoBox.style.opacity = "1";
    
    } else {

        
   const { data, error } = await
   supabaseClient
   .from("moody")
   .insert([
    {
        username: currentUser,
        emoji: emoji,
        mood: mood,
        caption: caption,
        image: selectedImage,
        profilepic: 
        localStorage.getItem("profilePic") 
        || "",
        likes: 0,
        time: time
    }
   ]);

   console.log("DATA:", data);
   console.log("ERROR:", error);

   

   if(error){
    console.log(error);

    postBtn.disabled = false;


    return;

   }

   await loadFeed();

   popup.style.display = "none";

   postBtn.disabled = false;
   

   // location.reload();

   
    console.log(localStorage.getItem("posts"));

    setupCommentsButtons();

    


    emojiInput.value = "";
    moodInput.value = "";
    captionInput.value = "";

    postBtn.innerText = "post";

    selectedImage = "";
    selectedType = "";

    photoBox.innerHTML = 
    "📷 Add Photo";

    popup.style.display = "none";

    feed.scrollTo({
        top: 0,
        behavior: "smooth"
    
    });
}
    


};

const searchInput = 
document.getElementById("searchInput");

searchInput.addEventListener("input" , () => {

    const searchText = 
    searchInput.value.toLowerCase();

    const cards = 
    document.querySelectorAll(".mood-card");

    cards.forEach(card => {

        const moodTittle = 
        card.querySelector("h3")
        .innerText
        .toLowerCase();
        console.log(moodTittle)

        if (moodTittle.includes(searchText)) {
            card.style.display = "";
        }

        else {
            card.style.display = "none";
        }
    });
});

async function loadFeed() {

    const { data: savedPosts, error  } =
    await supabaseClient
    .from("moody")
    .select("*")
    .order("id", { ascending: false});

    

    if(error){

        console.log(error);
        return;
    }

    console.log("POSTS:", savedPosts);

    feed.innerHTML = "";

    console.log(savedPosts);
    




savedPosts.forEach((post, index) => {

    console.log(post);
    console.log("EMOJI FROM DB:",
        post.emoji);
    



    post.caption = post.caption || "";

    console.log(post);

    feed.innerHTML += `
    <div class="mood-card">

    <div class="post-header">
    
    <img class="post-profile-pic"
    src="$
    {localStorage.getItem("profilePic") ||
    ""}">    

    <div class="post-username">
    ${post.username}

    </div>
    </div>


    <div class="mood-image">
       ${post.type &&
    post.type.startsWith("video/")
? `<video src="${post.image}"

style="width:100%;
height:100%;
object-fit:cover;
border-radius:30px;"
autoplay
muted
loop>
</video>`
: (post.image
    ?`<img src="${post.image}"
    style="width:100%;
    height:100%;
    object-fit:cover;
    border-radius:30px;">`
    : post.emoji)}
      </div>

      <h3>${post.mood}</h3>
      
      <p class="caption"
      data-full="${post.caption}"
      data-short="${post.caption.length > 50
        ? post.caption.substring(0,50) +
        '...'
        : post.caption}"

        onclick="
        if(this.innerText===this.dataset.short
      ){
        this.innerText=this.dataset.full;
        }else{
            this.innerText=this.dataset.short;
        }
            ">
      
      ${post.caption.length > 50
        ? post.caption.substring(0,50) + "..."
        : post.caption}
        
        </p>
        
        <p class="time">
          ${post.time}
          </p>

          <div class="action-row">

          <div 
          class="post-actions like-btn"
          data-index="${index}"
          data-postid="${post.id}">
          ❤️<span class="like-count">${post.likes || 0}</span>
          Likes
          </div>

          <div class="post-actions comments-btn"
          data-index="${index}"
          data-postid="${post.id}">
          💬 comments
          </div>

          </div>

          
          `;

});

setupLikeButtons();
setupCommentsButtons();

}

loadFeed();

profileBtn.addEventListener("click" , async () => 
{
    await loadProfile();

    feed.style.display  = "none";
    profilePage.style.display= "block";
});

homeBtn.addEventListener("click" , () => {

    loadProfile();

    profilePage.style.display = "none";
    feed.style.display = "block";
   
    
});


async function loadProfile() {

    const { data: profile } = await
    supabaseClient
    .from("profiles")
    .select("*")
    .eq("username", currentUser)
    .single();

    if(profile){
        profileName.textContent =
        profile.username;
    }

    const { data: userPosts, error } =
    await supabaseClient
    .from("moody")
    .select("*")
    .eq("username", currentUser)
    .order("id", { ascending:
        false });

        if(error){
            console.log(error);
            return;

        }


    postCount.innerText = 
    userPosts.length;

    const myPostsCount = 
    document.getElementById("myPostsCount");

    if(myPostsCount){
        myPostsCount.innerText = 
        userPosts.length + "Posts";
    }

    myPosts.innerHTML = "";

    myPosts.style.display = "none";

    userPosts.forEach((post, index)=> {

        myPosts.innerHTML += `
        <div class="mood-card">

        <div class="post-menu"
        onclick="showMenu(${index})">⋮</div>


          <div class="mood-image">
          ${post.type && post.type.startsWith("video/")
 ? `<video src="${post.image}"
    style="width:100%;
    height:100%;
    object-fit:cover;
    border-radius:30px;"
    autoplay
    muted
    loop>
    </video>`
 : post.image
 ? `<img src="${post.image}"
    style="width:100%;
    height:100%;
    object-fit:cover;
    border-radius:30px;">`
 : post.emoji}
          
          </div>

          <h3>${post.mood}</h3>

          <p class="caption">
          ${post.caption}
          </p>

          <p class="time">
          ${post.time}
          </p>

          </div>
          `;

    });
}


function showMenu(index) {

    selectedPostIndex = index;

menuPopup.style.display = "block";

}
photoBox.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", () => {

    const file = photoInput.files[0];

    console.log(file);

    selectedType = file.type;

    if(file){

        console.log("File selected");

        const reader = new FileReader();

        reader.onload = function(e){

            console.log("Reader loaded");

            selectedImage = e.target.result;

            photoBox.innerHTML = 
            `<img src="${e.target.result}"
            style="width:100%;
            height:100%;
            object-fit:cover;
            border-radius:15px;">`;
        };

        reader.readAsDataURL(file);
    }
});


editPostBtn.addEventListener("click", () => {

    let posts = 
    JSON.parse(localStorage.getItem("posts")) ||
    [];

    let post = posts[selectedPostIndex];

    document.getElementById("moodInput").value =
    post.mood;

    document.getElementById("captionInput").value = 
    post.caption;

    postBtn.innerText = "Update Post";

    selectedImage = post.image;
    selectedType = post.type;

    if (post.image) {

        photoBox.innerHTML = 
        `<img src="${post.image}"
        style="width:100%;
        height:100%;
        object-fit:cover;
        border-radius:15px;">`;
    }

    photoBox.style.pointerEvents = "none";
    photoBox.style.opacity = "0.7";

    

    isEditing = true;

    popup.style.display = "flex";

    menuPopup.style.display = "none";
});



deletePostBtn.addEventListener("click", () => {

    menuPopup.style.display = "none";
    deletePopup.style.display = "flex";

});

cancelDelete.addEventListener("click", () => {

    deletePopup.style.display = "none";

 });

 confirmDelete.addEventListener("click", () => {

    let posts = 

    JSON.parse(localStorage.getItem("posts"))
    || [];

    posts.splice(selectedPostIndex, 1);

    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );

    deletePopup.style.display = "none";

    loadProfile();

    myPosts.style.display ="block";

 });


 document.addEventListener("click", (e) => {

    if (!menuPopup.contains(e.target) &&
    !
    e.target.classList.contains("post-menu")) {
        menuPopup.style.display = "none";
    }
 });

 document.addEventListener("click", (e) => {

    if(e.target.classList.contains("short-caption")){

       e.target.classList.toggle("expanded");
    }
 });


 const myPostsCard =
 document.getElementById("myPostsCard");

 myPostsCard.addEventListener("click", 
    () => {

    if(myPosts.style.display === 
        "none"){

            myPosts.style.display = 
            "block";

        } else {

            myPosts.style.display =
            "none";
        }
 });



 const profilePic = 
 document.querySelector(".profile-pic");

 const profileMenu = 
 document.getElementById("profileMenu");

 const editPic =
 document.getElementById("editPic");

 const removePic =
 document.getElementById("removePic");

 profilePic.addEventListener("click", () => {

    if(profileMenu.style.display ===
        "block"){

            profileMenu.style.display =
            "none";
        }else{

            profileMenu.style.display = 
            "block";
        }
    
 });


 document.addEventListener("click", (e) => {

    if(
        !profilePic.contains(e.target)
        &&
        !
        profileMenu.contains(e.target)
    ){

        profileMenu.style.display = "none";
    }
 });
 

 const settingsBtn = 
 document.getElementById("settingsBtn");

 
 const settingsPanel = 
 document.getElementById("settingsPanel");

 settingsBtn.addEventListener("click", () => {

    settingsPanel.classList.toggle("open")
    ;

 });

 document.addEventListener("click", (e) => {

    if(
        !
        settingsPanel.contains(e.target)
        &&
        !
        settingsBtn.contains(e.target)
    ){

        settingsPanel.classList.remove("open")
        ;
    }
 });


 const darkThemeBtn =
 document.getElementById("darkThemeBtn");

 darkThemeBtn.addEventListener("click", () => {

    window.location.href = 
    "darkmoody.html";
 });
 

 const commentsPanel =
 document.getElementById("commentsPanel");

 const commentsList =
 document.getElementById("commentsList");

 const commentInput =
 document.getElementById("commentInput");

 const commentPostBtn =
 document.getElementById("commentPostBtn");

 console.log(commentPostBtn);

 let selectedCommentPost = 0;


 function setupCommentsButtons(){

    document
    .querySelectorAll(".comments-btn")
    .forEach(btn => {

        btn.onclick = () => {

            selectedCommentPost =
            btn.dataset.postid;

            loadComments();

            commentsPanel
            .classList
            .add("open");
        };
    });
 }


 document.addEventListener(
    "click",
    (e) => {

        if(
            !commentsPanel.contains(
                e.target
            )
            &&
            !e.target.classList.contains(
                "comments-btn"
            )
        ){

            commentsPanel
            .classList
            .remove("open");
        }
    });



    const editProfileBtn =
    document.getElementById("editProfileBtn");

    editProfileBtn.addEventListener("click", () => {

        profileUpload.click();
    });


    const profileUpload = 
    document.getElementById("profileUpload");

    

    const profileImage = 
    document.getElementById("profileImage");
    
    const savedPic =
    localStorage.getItem("profilePic");

    if(savedPic){

        profileImage.src =
        savedPic;
    }
    else{

        profileImage.src = "profile-icon.png";
    }

    const previewPopup =
    document.getElementById("previewPopup");

    const previewImage = 
    document.getElementById("previewImage");

    const updateProfilePic =
    document.getElementById("updateProfilePic");

    const cancelProfilePic =
    document.getElementById("cancelProfilePic");

    updateProfilePic.addEventListener("click", () => {

        profileImage.src = 
        tempProfileImage;

        localStorage.setItem(
            "profilePic",
            tempProfileImage
        );

        saveProfilePicToSupabase();

        previewPopup.style.display =
        "none";
    });


    cancelProfilePic.addEventListener("click", () => {

        previewPopup.style.display =
        "none";

        tempProfileImage = "";
    });


    let tempProfileImage = "";

    profileUpload.addEventListener("change", () => {

        const file =
        profileUpload.files[0];

        if(file){

            const reader =
            new FileReader();

            reader.onload = function(e){

                tempProfileImage = 
                e.target.result;

                previewImage.src =
                tempProfileImage;

                previewPopup.style.display = "flex";
            };

            reader.readAsDataURL(file);
        }
    });



    async function loadComments() {

        commentsList.innerHTML = "";

        console.log("Selected:",
            selectedCommentPost);

        const postId = 
        Number(selectedCommentPost);

        console.log("Post ID:", postId);




        const { data, error } =
        await supabaseClient
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        
        .order("id", { ascending: true });

        console.log("Comments:", data);
        console.log("Error:", error);

       if(error){
        console.log(error);
        return;
       }
        

        data.forEach((comment) => {

            commentsList.innerHTML += `
            <div class="comment-item">
            
            <img class="comment-pic"
            src="${comment.profilepic ||
                'https://i.pravatar.cc/50'}">
                
                <div class="comment-content">
                
                <div class="comment-user">
                ${comment.username}
                </div>
                
                <div class="comment-text">
                ${comment.text}
                </div>
                
                </div>
                
                </div>
                `;
        });
        
    }








    commentPostBtn.addEventListener("click", async () => {

        const text =
        commentInput.value.trim();

        if(text === "") return;

       
       const postId = Number(
        selectedCommentPost
       );
      
       

       

       await supabaseClient
       .from("comments")
       .insert([
        {
            post_id: postId,
            username: currentUser,
            text: text,
            profilepic:
            localStorage.getItem("profilePic")
            || ""
        }
       ]);


        commentInput.value = "";

       await loadComments();
    });


    const headerSection =
    document.getElementById("headerSection");

    const feedContainer =
    document.getElementById("feed");

    let lastScroll = 0;

    feedContainer.addEventListener("scroll", () => {

        let currentScroll =
        feedContainer.scrollTop;

        if(currentScroll > 50){

            headerSection.style.transform

            =

            "translateY(-120px)";

        }
        else{

            headerSection.style.transform

            =

            "translateY(0)";
        }
    });


    async function 
    saveProfilePicToSupabase() {

        const { error } = await
        supabaseClient
        .from("profiles")
        .upsert([
            {
                username: currentUser,
                profilepic:
                tempProfileImage
            }
        ]);

        if(error){
            console.log(error);

        } else {
            console.log("Profile pic saved!")
        }
    }

    editPic.addEventListener("click", () => {

        profileUpload.click();

        profileMenu.style.display = "none";
    });


    removePic.addEventListener("click", () => {

        profileImage.src = "profile-icon.png";

        localStorage.removeItem("profilePic");

        profileMenu.style.display = "none";
    });





   

    
 
 

        
        

