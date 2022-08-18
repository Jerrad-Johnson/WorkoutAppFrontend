import CustomizedMenus from "./DropdownMenu";

function Nav({title}: {title: string}){
    return (
        <div className={"basicContainer headerContainer"}>
            <div className={"headerLeft"}>
                <span className={"pageTitle"}>{title}</span>
            </div>
            <div className={"headerRight"}>
                <CustomizedMenus/>
            </div>
        </div>
    );
}

export default Nav;