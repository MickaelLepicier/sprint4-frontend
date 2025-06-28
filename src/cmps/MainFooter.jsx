import { FacebookIcon } from './svg/FacebookIcon'
import { InstagramIcon } from './svg/InstagramIcon'
import { TwitterIcon } from './svg/TwitterIcon'

export function MainFooter() {
	return (
		<footer className="main-footer">
            <hr className="footer-divider"></hr>
            <div>
                <nav className="footer-nav">
                    <div className="footer-top">
                        <div className="footer-links">
                            <div className="footer-column">
                                <ul>
                                    <li><h3>Company</h3></li>
                                    <li><a href="#">About</a></li>
                                    <li><a href="#">Jobs</a></li>
                                    <li><a href="#">For the Record</a></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <ul>
                                    <li><h3>Communities</h3></li>
                                    <li><a href="#">For Artists</a></li>
                                    <li><a href="#">Developers</a></li>
                                    <li><a href="#">Advertising</a></li>
                                    <li><a href="#">Investors</a></li>
                                    <li><a href="#">Vendors</a></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <ul>
                                    <li><h3>Useful links</h3></li>
                                    <li><a href="#">Support</a></li>
                                    <li><a href="#">Free Mobile App</a></li>
                                    <li><a href="#">Popularity by Country</a></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <ul>
                                    <li><h3>MisetBeat Plans</h3></li>
                                    <li><a href="#">Premium Individual</a></li>
                                    <li><a href="#">Premium Duo</a></li>
                                    <li><a href="#">Premium Family</a></li>
                                    <li><a href="#">Premium Student</a></li>
                                    <li><a href="#">MisetBeat Free</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="footer-social">
                            <div className="social-link-wrapper">
                                <a><InstagramIcon /></a>
                            </div>
                            <div className="social-link-wrapper">
                                <a><TwitterIcon /></a>
                            </div>
                            <div className="social-link-wrapper">
                                <a><FacebookIcon /></a>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="footer-divider secondary"></hr>

                    <section className="footer-bottom">
                        <div className="legal-links">
                            <div className="link-wrapper"><a>Legal</a></div>
                            <div className="link-wrapper"><a>Safety & Privacy Center</a></div>
                            <div className="link-wrapper"><a>Privacy Policy</a></div>
                            <div className="link-wrapper"><a>Cookies</a></div>
                            <div className="link-wrapper"><a>About Ads</a></div>
                            <div className="link-wrapper"><a>Accessibility</a></div>
                        </div>
                        
                        <div className="copyright-wrapper">
                            <p className="copyright">© 2025 MisterBeat AB</p>
                        </div>
                    </section>
                </nav>
            </div>
		</footer>
	)
}
