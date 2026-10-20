const SUPABASE_URL =
"https://hpgnwdyzqwiilicaebiz.supabase.co";

const SUPABASE_KEY =
"sb_publishable_cDhOldcrkpj_khGL4N6Cfg_-AAJJE_T";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



const loginBtn = 
document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const username = 
    document.getElementById("username").value;

    const password = 
    document.getElementById("password").value;

   const { data: foundUser, error } =
   await
   supabaseClient
   .from("users")
   .select("*")
   .eq("username", username)
   .eq("password", password)
   .single();

   console.log(foundUser);
   console.log(error);

   if(error && error.code !== "PGRST116")
   {
    console.log(error);
   }


   if(foundUser){

    localStorage.setItem(
        "currentUser",
        foundUser.username
    );

    await supabaseClient
    .from("profiles")
    .upsert([
        {
            username: foundUser.username
        }
    ],
{
    onConflict: "username"
});

    alert("Login Successful ");

    window.location.href = "moody.html";
   }
   else{

    alert("Wrong Username or Password");
   }});


const signupLink = 
document.getElementById("signupLink");

signupLink.addEventListener("click", () => {

    window.location.href = 
    "signup.html";
});