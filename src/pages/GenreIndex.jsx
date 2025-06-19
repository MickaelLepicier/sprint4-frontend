import { GenreList } from '../cmps/GenreList'

const genres = [
    { name: 'Music', color: 'rgb(220, 20, 140)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/music_lddsij.jpg' },
    { name: 'Podcasts', color: 'rgb(0, 100, 80)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/podcasts_lcfrd5.jpg' },
    { name: 'Live Events', color: 'rgb(132, 0, 231)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/live-events_advjob.jpg' },
    { name: 'Made For You', color: 'rgb(30, 50, 100)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/made-for-you_np248d.png' },
    { name: 'New Releases', color: 'rgb(96, 129, 8)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/new-releases_fujvva.jpg' },
    { name: 'Pop', color: 'rgb(71, 125, 149)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/pop_excdol.jpg' },
    { name: 'Hip-Hop', color: 'rgb(71, 125, 149)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/hip-hop_mlqt1q.jpg' },
    { name: 'Rock', color: 'rgb(0, 100, 80)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/rock_yjafwg.jpg' },
    { name: 'Latin', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/latin_szrz08.jpg' },
    { name: 'Podcast Charts', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/podcasts-charts_dz9ljd.jpg' },
    { name: 'Educational', color: 'rgb(71, 125, 149)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/educational_xltvvv.jpg' },
    { name: 'Documentary', color: 'rgb(80, 55, 80)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/documentary_nlv9zf.jpg' },
    { name: 'Comedy', color: 'rgb(175, 40, 150)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/comedy_idakyo.jpg' },
    { name: 'Charts', color: 'rgb(141, 103, 171)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/charts_biuvmm.jpg' },
    { name: 'Dance Electronic', color: 'rgb(71, 125, 149)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/dance-electronics_zluxdt.jpg' }, 
    { name: 'Mood', color: 'rgb(225, 17, 140)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/mood_aaacea.jpg' },
    { name: 'Indie', color: 'rgb(233, 20, 41)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/all-new-indie_fjroil.jpg' },
    { name: 'Workout', color: 'rgb(119, 119, 119)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/cardio_ay7yr5.jpg' }, 
    { name: 'Discover', color: 'rgb(141, 103, 171)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/discover_ebpzxt.jpg' },
    { name: 'Country', color: 'rgb(216, 64, 0)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/country_unwzq6.jpg' },
    { name: 'R&B', color: 'rgb(186, 93, 7)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/rhythm-n-blues_uh55lo.jpg' }, 
    { name: 'K-pop', color: 'rgb(230, 30, 50)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/k-pop_qsm0ld.jpg' },
    { name: 'Chill', color: 'rgb(176, 98, 57)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/chill-vibes_bt4kbe.jpg' }, 
    { name: 'Sleep', color: 'rgb(30, 50, 100)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/sleep_xcngph.jpg' },
    { name: 'Party', color: 'rgb(141, 103, 171)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/party_vpkvlg.jpg' },
    { name: 'At Home', color: 'rgb(81, 121, 161)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/at-home_vipjzu.jpg' },
    { name: 'Decades', color: 'rgb(165, 103, 82)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/decades_ck3ef4.jpg' },
    { name: 'Love', color: 'rgb(220, 20, 140)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/love_pyskpy.jpg' },
    { name: 'Metal', color: 'rgb(233, 20, 41)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/metal_fds943.jpg' },
    { name: 'Jazz', color: 'rgb(141, 103, 171)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/jazz_q7roin.jpg' },
    { name: 'Trending', color: 'rgb(176, 40, 151)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/trending_fb7igy.jpg' },
    { name: 'Wellness', color: 'rgb(20, 138, 8)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/wellness_wbwubx.jpg' },
    { name: 'Anime', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/anime_g3xn3c.jpg' },
    { name: 'Gaming', color: 'rgb(232, 17, 91)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/gaming_dkfbye.jpg' },
    { name: 'Folk & Acoustic', color: 'rgb(188, 89, 0)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/folk-and-acoustic_z8rcgl.jpg' },
    { name: 'Focus', color: 'rgb(165, 103, 82)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/focus_ne2x5j.jpg' },
    { name: 'Soul', color: 'rgb(220, 20, 140)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/soul_y19e9e.jpg' },
    { name: 'Kids & Family', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/kids-and-family_zusgku.jpg' },
    { name: 'Classical', color: 'rgb(125, 75, 50)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/classical_uqznns.jpg' },
    { name: 'TV & Movies', color: 'rgb(20, 138, 8)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/tv-and-movies_jtbvot.jpg' },
    { name: 'Instrumental', color: 'rgb(83, 122, 161)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/instrumental_varmgw.jpg' },
    { name: 'Punk', color: 'rgb(230, 30, 50)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/punk_pbdjr0.jpg' },
    { name: 'Ambient', color: 'rgb(20, 138, 8)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/ambient-essentials_ubnyb6.jpg' },
    { name: 'Netflix', color: 'rgb(230, 30, 50)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/netflix_iewjrb.jpg' },
    { name: 'Blues', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/blues_awqd7m.jpg' },
    { name: 'Cooking & Dining', color: 'rgb(186, 93, 7)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/cooking-and-dining_ughhhh.jpg' },
    { name: 'Alternative', color: 'rgb(225, 51, 0)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/alternative_v7ocef.jpg' },
    { name: 'Travel', color: 'rgb(13, 114, 237)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/travel_fyubs6.jpg' },
    { name: 'Caribbean', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/caribbean_cxtkvg.jpg' },
    { name: 'Afro', color: 'rgb(140, 25, 50)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/afro_q3l69d.jpg' },
    { name: 'GLOW', color: 'rgb(13, 115, 236)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/glow_bptnxm.jpg' },
    { name: 'Songwriters', color: 'rgb(140, 25, 50)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/songwriters_w4r3j0.jpg' },
    { name: 'Nature & Noise', color: 'rgb(71, 125, 149)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/nature-and-noise_pu9erk.jpg' },
    { name: 'Funk & Disco', color: 'rgb(175, 40, 150)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/funk-and-disco_bln5zd.jpg' },
    { name: 'Spotify Singles', color: 'rgb(119, 119, 119)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/spotify-singles_arbb0v.jpg' },
    { name: 'Summer', color: 'rgb(39, 133, 106)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/summer_gmfqr3.jpg' },
    { name: 'EQUAL', color: 'rgb(20, 138, 8)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/equal_lms84d.jpg' },
    { name: 'RADAR', color: 'rgb(165, 103, 82)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/radar_ss10lf.jpg' },
    { name: 'Fresh Finds', color: 'rgb(225, 0, 144)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/fresh-finds_toimcg.jpg' },
    { name: 'Tastemakers', color: 'rgb(232, 17, 91)', imgUrl: 'https://res.cloudinary.com/dkxnyqrkc/image/upload/v1748422332/tastemakers_kxhbj0.png' }
]

export function GenreIndex() {

    return (
        <section className="genre-index">
                <div className="genre-title-wrapper flex">
                    <h2 className="genre-title">Browse all</h2>
                </div>
                
                <GenreList genres={genres} />
        </section>
    )
}
