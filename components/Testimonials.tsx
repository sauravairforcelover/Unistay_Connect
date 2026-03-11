export default function Testimonials() {
  const testimonials = [
    {
      name: "Ethan Carter",
      date: "2023-08-15",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBX8jRHlwcUcygANiBW7OjTj167SiRaQ3TJ9gSE8XsH7KkwTrNlkptn1LdjGO4jJkZ2wArDvI7iIv2nmJDnEWzhWPGwwlJQ4xTf7U2tri34ayheef_tAGo-Yqz9j_9Dit3-m9xL427MFbPiVDeMUmepLq6UTX_xggI6jmJwphYO-g8_JwH7sxZAE1xyNvtYIRBTf8cLAzaTMm3WQWM2SJjokJ1C5a_lAsCPadmUHzTvLPAKElrsqU3aeiT3QP2SYBIa3EknJNXR034",
      rating: 5,
      text: "UniStayConnect made finding my accommodation so easy! The verified listings gave me peace of mind, and I found a great place near campus.",
    },
    {
      name: "Olivia Bennett",
      date: "2023-09-20",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy1gkQH8nADsBfrsG8wXM5FZXmka37yb5iFtNCzKt2ezP4dDQeGBKCZrEYlKOaXqS9aZn5MKhSGvaP3rUM4tncdS7_W_G6UUb-sFdglzaduKRJ4LaltR_IT6BSO2VoCQy_aK_ISMM8YT2KiU_RzFq7KwN0-1yQvKYsCnQBrtC0Xrenceq7qAb6Tv_GCIjvPFkF1M_dHEtGwa3V3qNr5T0JHMseHSS8fmF-2kraDawAI0Lf9M9YkVqEh0lxmjyaH1E9jezRr56O7Ps",
      rating: 4,
      text: "I had a good experience using UniStayConnect. The platform is user-friendly, and I found a suitable accommodation quickly. However, more options in my budget would be appreciated.",
    },
    {
      name: "Noah Thompson",
      date: "2023-10-05",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6aAC3dWYezqKXHC4X-oIj2SGv79rnzAeaPF78yuqMHseEtdoUNYp1yh4A4FgeIZPGqQlDWuCq2H0zUgt77sHAIF6J4pwV5nXQrJ5aG1mIscFT0x0yEQXfQ6stAsj3qpBWUF1409u2w0xov5myRX9UEkAp8ssV1_AWA7K85tL0HKyaMdzhNwN23xEebvAPKi4xfRJTx3fetcZw_V9_twYDgrSnoso5mZlJu7Ec2b7xFta_cGHbS3xbj1bFN3kQ7BEa-K8UyiBxOKI",
      rating: 5,
      text: "I love UniStayConnect! It's a fantastic platform for students. I found a wonderful place and connected with other students even before moving in.",
    },
  ];

  return (
    <>
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Testimonials
      </h2>
      <div className="flex flex-col gap-8 overflow-x-hidden bg-white p-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="flex flex-col gap-3 bg-white">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{ backgroundImage: `url(${testimonial.avatar})` }}
              ></div>
              <div className="flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal">{testimonial.name}</p>
                <p className="text-[#617589] text-sm font-normal leading-normal">{testimonial.date}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-[#111418]">
                  {i < testimonial.rating ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#bac4ce" viewBox="0 0 256 256">
                      <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[#111418] text-base font-normal leading-normal">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}

