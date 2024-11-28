import React from "react";

export default function Home() {
  return (
    <div className="h-[46.5rem]  pt-[8rem] text-center md:pt-[15rem]">
      <div className="grid gap-y-10">
      <p className="font-light">
        سلام این یک متن تست با فونت ایران سنس است
        <br />
        hello this is a test text with iransans font
      </p>
      <p>
        سلام این یک متن تست با فونت ایران سنس نیست
        <br />
        hello this is a test text without iransans font
      </p>
      </div>
    </div>
  );
}
