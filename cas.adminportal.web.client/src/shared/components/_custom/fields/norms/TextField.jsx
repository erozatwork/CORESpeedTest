import { Input } from "@shared/components/ui/input";

export const TextField = ({ icon, className, placeholder, ...props }) => {
    return (
        <>
            <div className="relative">
                {icon && (
                    <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
                        {icon}
                    </div>
                )}
                <Input
                    type="text"
                    placeholder={placeholder}
                    className={`${className} ${icon && `pl-8`}`}
                    {...props}
                />
            </div>
        </>
    );
};
