function sendMail() {
  const form1 = document.getElementById("email-form");
  const form2 = document.getElementById("experience-form");

  // Step 1: Collect form data
  const user_name = form1.name.value;
  const user_email = form1.Email.value;
  const user_phone = form1.Phone.value;
  const user_college = form1.College.value;
  const degree = form1.Degree.value;
  const year = form1.Year.value;
  const location = form1.Location.value;
  const field = form1.Field.value;
  const duration = form1.Duration.value;
  const mode = form1.Mode.value;

  const experience = form2.Experience.value;
  const experience_desc = form2["Experience-Desc"].value;
  const motivation = form2.Motivation.value;
  const payment_ref = form2["Payment-Ref"].value;
  const payment_ss_file = form2["Payment-Screenshot"].files[0];

  const imgbbApiKey = "3123d94582cb67346c90b704764a0253";

  // Prepare email parameters
  const buildParams = (screenshotUrl) => ({
    user_name,
    user_email,
    user_phone,
    user_college,
    degree,
    year,
    location,
    field,
    duration,
    mode,
    experience,
    experience_desc,
    motivation,
    payment_ref,
    payment_ss: screenshotUrl,
    timestamp: new Date().toLocaleString(),
  });

  const sendEmails = (params) => {
    // 1. Company Notification
    emailjs
      .send("service_9o0jxmd", "template_5xldgnh", {
        ...params,
        company_email: "nexgennextopia@gmail.com",
      })
      .then(() => console.log("✅ Admin email sent"))
      .catch((err) => console.error("❌ Admin email failed:", err));

    // 2. Auto-reply to User
    emailjs
      .send("service_9o0jxmd", "template_5xldgnh", params)
      .then(() => console.log("✅ Auto-reply sent to user"))
      .catch((err) => console.error("❌ Auto-reply failed:", err));
  };

  if (payment_ss_file) {
    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result.split(",")[1];

      const formData = new FormData();
      formData.append("key", imgbbApiKey);
      formData.append("image", base64Image);

      fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          const screenshotLink = data.data.url;
          const emailParams = buildParams(screenshotLink);
          sendEmails(emailParams);
        })
        .catch((err) => {
          console.error("❌ ImgBB upload failed:", err);
          const fallbackParams = buildParams("ImgBB upload failed");
          sendEmails(fallbackParams);
        });
    };
    reader.readAsDataURL(payment_ss_file);
  } else {
    const fallbackParams = buildParams("No screenshot uploaded");
    sendEmails(fallbackParams);
  }
}
