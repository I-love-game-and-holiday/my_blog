import {Footer, ThemeSwitch} from "nextra-theme-blog";
import {getPageMap} from "nextra/page-map";
import {Navbar} from "@/components/navbar";
import {Search} from "nextra/components";
import React from "react";

const CustomFooter = async () => {
    return (
        <div className="pt-32">
            <div className="space-y-6">
                <Navbar pageMap={await getPageMap()}/>

                <div className="flex justify-between items-center gap-4">
                    <div className="flex gap-2 items-center">
                        <ThemeSwitch/>
                        <div>
                            © {new Date().getFullYear()}{' '}
                            <br className="md:hidden" />
                            <span className="inline md:hidden">エンジニア田中</span>
                            <span className="hidden md:inline">ウツ上がりエンジニア田中</span>
                        </div>
                        <a 
                            href="https://x.com/utu_engineer_" 
                            className="block transition-transform hover:scale-110 cursor-pointer" 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img 
                                src="/yuka.jpg" 
                                alt="twitter-link" 
                                className="w-10 h-10 rounded-full object-cover transition-opacity hover:opacity-80"
                            />
                        </a>
                    </div>
                    <Search placeholder="記事を検索..."/>
                </div>
            </div>
        </div>
    );
};

export default CustomFooter;