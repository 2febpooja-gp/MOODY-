const SUPABASE_URL =
"https://hpgnwdyzqwiilicaebiz.supabase.co";

const SUPABASE_KEY =
"sb_publishable_cDhOldcrkpj_khGL4N6Cfg_-AAJJE_T"

const supabaseClient = 
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);




const signupBtn =
document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () =>{

    const username =
    document.getElementById("username").value;

    const password = 
    document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value

    if(username === "" ||
         password === "" ||
        confirmPassword === ""
    ){
        alert("Fill all fields");
        return;

    }

    if(password !== confirmPassword){

        alert("Password does not match");

        return;
    }

    const { data: existingUser } = await
    supabaseClient
    .from("users")
    .select("*")
    .eq("username", username);

    if(existingUser.length > 0){

        alert("Account already exists!");
        return;
    }

    const { error } = await supabaseClient
    .from("users")
    .insert([
        {
            username: username,
            password: password
        }
    ]);

    if(error){
        console.log(error);
        alert("signup failed");
        return;
    }

    alert("Account Created!");

    window.location.href = 
    "login.html";
});


const loginLink =
document.getElementById("loginLink");

loginLink.addEventListener("click", () => {

    window.location.href = "login.html";
});