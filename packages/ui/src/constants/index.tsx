const createNavLink = (id: string, title: string) => ({ id, title });
export const navLinks = [
    createNavLink("home", "Home"),
    createNavLink("features", "Features"),
    createNavLink("quote", "Quote"),
    createNavLink("contact", "Contact"),
];

import {useState, useEffect} from 'react';
import { getUserRole } from '../userRole';
import { IconBaseProps } from "react-icons";
import { IoSettingsOutline, IoPerson, IoNotifications, IoAnalytics, IoHome } from "react-icons/io5";
const createDashNavLink = (id: string, title: string, logo: { (props: IconBaseProps): JSX.Element; (props: IconBaseProps): JSX.Element; (props: IconBaseProps): JSX.Element; (props: IconBaseProps): JSX.Element; (props: IconBaseProps): JSX.Element; }) => ({ id, title, logo });

const allDashNavLinks = [
    createDashNavLink("dashboard", "Dashboard", IoHome),
    createDashNavLink("notifications", "Notifications", IoNotifications),
    createDashNavLink("finance", "Finance", IoAnalytics),
    createDashNavLink("userProfile", "Profile", IoPerson),
    createDashNavLink("settings", "Settings", IoSettingsOutline),
];

let userRole = getUserRole();

export const dashNavLinks = userRole === 'Condo Management Company' ? allDashNavLinks : allDashNavLinks.filter(link => link.id !== "finance");

export const footerLinks = [
    {
        title: "Partners",
        links: [
            {
                name: "Websites",
                link: "https://www.somewhere.com/websites/",
            },
            {
                name: "Social Medias",
                link: "https://www.somewhere.com/social-medias/",
            },
            {
                name: "Branding",
                link: "https://www.somewhere.com/branding/",
            }
        ],
    },
    {
        title: "About",
        links: [
            {
                name: "Newsletters",
                link: "https://www.somewhere.com/newsletters/",
            },
            {
                name: "Our Team",
                link: "https://www.somewhere.com/our-team/",
            },
            {
                name: "Terms & Services",
                link: "https://www.somewhere.com/terms-and-services/",
            },
        ],
    },
    {
        title: "Support",
        links: [
            {
                name: "Help Center",
                link: "https://www.somewhere.com/help-center/",
            },
            {
                name: "Our Objectives",
                link: "https://www.somewhere.com/our-objectives/",
            }
        ],
    },
];

export const socialMedia = [
    {
        id: "social-media-1",
        icon: "/instagram.svg",
        link: "https://www.instagram.com/",
    },
    {
        id: "social-media-2",
        icon: "/facebook.svg",
        link: "https://www.facebook.com/",
    },
    {
        id: "social-media-3",
        icon: "/twitter.svg",
        link: "https://www.twitter.com/",
    },
    {
        id: "social-media-4",
        icon: "/linkedin.svg",
        link: "https://www.linkedin.com/",
    },
];