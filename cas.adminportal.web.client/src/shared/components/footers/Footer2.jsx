import { Link } from "react-router-dom";
import {
    FacebookLogo,
    LinkedinLogo,
    TiktokLogo,
    XLogo,
} from "@phosphor-icons/react";

const Footer2 = () => {
    return (
        <>
            <div className="mt-10 border-t border-[#ED1f24] flex flex-row gap">
                <div className="mt-4 text-2xs font-semibold flex-1">
                    <div>2025 | One CoreDev IT® | CORE®</div>
                    {/* <div>
                        <span className="text-[#ED1F24]">Address: </span>16th Floor, The Peak Tower, 107 L.P Leviste Street, Salcedo Village, Makati City, 1227 Metro Manila, Philippines
                    </div> */}
                </div>
                <div className="mt-4 flex-1">
                    <div className="flex flex-row gap-2 justify-end">
                        <Link
                            target="_blank"
                            to={"https://www.facebook.com/onecoredevit"}
                        >
                            <FacebookLogo size={20} weight="duotone" />
                        </Link>
                        <Link
                            target="_blank"
                            to={
                                "https://www.linkedin.com/company/onecoredevit/"
                            }
                        >
                            <LinkedinLogo size={20} weight="duotone" />
                        </Link>
                        <Link
                            target="_blank"
                            to={"https://www.tiktok.com/@onecoredevit"}
                        >
                            <TiktokLogo size={20} weight="duotone" />
                        </Link>
                        <Link target="_blank" to={"https://x.com/onecoredevit"}>
                            <XLogo size={20} weight="duotone" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export { Footer2 };
