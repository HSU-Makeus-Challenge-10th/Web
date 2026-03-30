interface ButtonProps {
    onClick: () => void;
    text: string;
    type?: "button" | "submit" | "reset";
}

const Button = ({ onClick, text, type = "button" }: ButtonProps) => {
    return (
        <button onClick={onClick} type={type}>{text}</button>
    );
};

export default Button;