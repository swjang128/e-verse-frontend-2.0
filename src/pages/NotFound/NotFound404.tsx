import Logo from '../../images/logo/logo_version.png';
import Illustration from '../../images/icon/illustration-04.svg';

function NotFound404() {
  return (
    <div className="grid-row no-scrollbar grid h-screen overflow-y-hidden bg-white text-center">
      <div className="grid h-15 items-center justify-center bg-gradient-to-r from-e_green to-e_blue">
        <img className="px-3 py-4" src={Logo} alt="Logo" />
      </div>
      <div className="flex justify-center">
        <div className="text-center">
          <span className="inline-block">
            <img src={Illustration} alt="illustration" />
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-[50px] font-black leading-[60px] text-black">
          404 Not Found
        </h2>
        <p className="font-medium">
          Page not found. Please Enter a Different Path.
        </p>
      </div>
    </div>
  );
}

export default NotFound404;
