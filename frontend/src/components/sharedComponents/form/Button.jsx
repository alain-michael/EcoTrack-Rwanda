import { Link } from "react-router-dom";
import DataProgressLoad from "../../Loads/DataProgressLoad";

const Button = (props) => {
  return (
    <>
      {props.to ? (
        <Link
          to={props.to}
          onClick={() => {
            props.onClick && props.onClick();
          }}
          className={`flex justify-center rounded-md border ${
            props.border ?? "border-transparent"
          }  py-2 px-4 text-sm font-medium shadow-sm focus:ring-2 ${
            props.color
              ? props.color
              : `hover:bg-dark-green  focus:ring-green bg-green text-white`
          } focus:outline-none  outline-none transition-colors duration-300 ${
            props.className
          }`}
        >
          {props.isLoading ? (
            <DataProgressLoad size={8} color="#fff" />
          ) : (
            <>
              {props.icon && <div>{props.icon}</div>}
              <div>{props.children ? props.children : props.label}</div>
            </>
          )}
        </Link>
      ) : (
        <button
          disabled={props.isLoading}
          onClick={() => {
            props.onClick && props.onClick();
          }}
          className={`flex justify-center rounded-md border ${
            props.border ?? "border-transparent"
          }  py-2 px-4 text-sm font-medium shadow-sm focus:ring-2 ${
            props.color
              ? props.color
              : `hover:bg-dark-green  focus:ring-green bg-green text-white`
          } focus:outline-none  outline-none transition-colors duration-300 ${
            props.className
          }`}
        >
          {props.isLoading ? (
            <SyncLoader size={8} color="#fff" />
          ) : (
            <>
              {props.icon && <div>{props.icon}</div>}
              <div>{props.children ? props.children : props.label}</div>
            </>
          )}
        </button>
      )}
    </>
  );
};

export default Button;
