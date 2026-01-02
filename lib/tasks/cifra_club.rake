namespace :cifra_club do
  desc "Scrape all available versions of a Cifra Club song"
  task :scrape_tab, [ :url ] => :environment do |t, args|
    unless args[:url]
      puts "Usage: rake cifra_club:scrape[url]"
      puts "Example: rake cifra_club:scrape['https://www.cifraclub.com.br/linkin-park/in-the-end/']"
      puts "This will scrape: principal, simplified, drum, and bass versions (if available)"
      exit 1
    end

    puts "Scraping all versions of Cifra Club song: #{args[:url]}"

    begin
      tabs = CifraClub::PageScraper.import_all_versions!(args[:url])

      puts "✓ Successfully scraped #{tabs.length} tabs:"
      tabs.each do |tab|
        version = tab.version_name.presence || "principal"
        puts "  - #{tab.artist_name} - #{tab.song_title} (#{tab.instrument}, #{version})"
        puts "    Source: #{tab.source}"
        puts "    Capo: #{tab.capo || 'None'}"
        puts "    YouTube Lesson: #{tab.youtube_lesson_url || 'None'}"
        puts "    YouTube Music: #{tab.song.youtube_music_url || 'None'}"
        puts "    Content length: #{tab.content.length} characters"
      end
    rescue => e
      puts "✗ Failed to scrape tabs: #{e.message}"
      puts e.backtrace.join("\n") if ENV["DEBUG"]
      exit 1
    end
  end

  desc "Scrape multiple artists (top 15 songs from each)"
  task scrape_artists: :environment do
    artist_urls = [
      "https://www.cifraclub.com.br/anavitoria/",
      "https://www.cifraclub.com.br/armandinho/",
      "https://www.cifraclub.com.br/almir-sater/",
      "https://www.cifraclub.com.br/adoniran-barbosa/",
      "https://www.cifraclub.com.br/ana-castela/",
      "https://www.cifraclub.com.br/alcione/",
      "https://www.cifraclub.com.br/alceu-valenca/",
      "https://www.cifraclub.com.br/amado-batista/",
      "https://www.cifraclub.com.br/arlindo-cruz/",
      "https://www.cifraclub.com.br/adriana-calcanhotto/",
      "https://www.cifraclub.com.br/art-popular/",
      "https://www.cifraclub.com.br/ana-carolina/",
      "https://www.cifraclub.com.br/ana-vilela/",
      "https://www.cifraclub.com.br/bruno-e-marrone/",
      "https://www.cifraclub.com.br/belo/",
      "https://www.cifraclub.com.br/barao-vermelho/",
      "https://www.cifraclub.com.br/banda-eva/",
      "https://www.cifraclub.com.br/biquini-cavadao/",
      "https://www.cifraclub.com.br/bezerra-da-silva/",
      "https://www.cifraclub.com.br/benito-di-paula/",
      "https://www.cifraclub.com.br/beth-carvalho/",
      "https://www.cifraclub.com.br/beto-guedes/",
      "https://www.cifraclub.com.br/chitaozinho-e-xororo/",
      "https://www.cifraclub.com.br/caetano-veloso/",
      "https://www.cifraclub.com.br/capital-inicial/",
      "https://www.cifraclub.com.br/chico-buarque/",
      "https://www.cifraclub.com.br/cesar-menotti-e-fabiano/",
      "https://www.cifraclub.com.br/cartola/",
      "https://www.cifraclub.com.br/calcinha-preta/",
      "https://www.cifraclub.com.br/cpm-22/",
      "https://www.cifraclub.com.br/charlie-brown-jr/",
      "https://www.cifraclub.com.br/cassia-eller/",
      "https://www.cifraclub.com.br/cazuza/",
      "https://www.cifraclub.com.br/chiclete-com-banana/",
      "https://www.cifraclub.com.br/cidade-negra/",
      "https://www.cifraclub.com.br/catedral/",
      "https://www.cifraclub.com.br/daniel/",
      "https://www.cifraclub.com.br/delacruz/",
      "https://www.cifraclub.com.br/djavan/",
      "https://www.cifraclub.com.br/detonautas/",
      "https://www.cifraclub.com.br/dilsinho/",
      "https://www.cifraclub.com.br/diogo-nogueira/",
      "https://www.cifraclub.com.br/engenheiros-do-hawaii/",
      "https://www.cifraclub.com.br/eli-soares/",
      "https://www.cifraclub.com.br/elis-regina/",
      "https://www.cifraclub.com.br/edu-ribeiro/",
      "https://www.cifraclub.com.br/exaltasamba-musicas/",
      "https://www.cifraclub.com.br/edson-e-hudson/",
      "https://www.cifraclub.com.br/erasmo-carlos/",
      "https://www.cifraclub.com.br/emilio-santiago/",
      "https://www.cifraclub.com.br/elba-ramalho/",
      "https://www.cifraclub.com.br/ed-motta/",
      "https://www.cifraclub.com.br/fernando-sorocaba/",
      "https://www.cifraclub.com.br/frejat/",
      "https://www.cifraclub.com.br/flavio-venturini/",
      "https://www.cifraclub.com.br/fresno/",
      "https://www.cifraclub.com.br/fabio-jr/",
      "https://www.cifraclub.com.br/falamansa/",
      "https://www.cifraclub.com.br/fagner/",
      "https://www.cifraclub.com.br/gusttavo-lima/",
      "https://www.cifraclub.com.br/revelacao/",
      "https://www.cifraclub.com.br/fundo-de-quintal/",
      "https://www.cifraclub.com.br/guilherme-e-santiago/",
      "https://www.cifraclub.com.br/gal-costa/",
      "https://www.cifraclub.com.br/gonzaguinha/",
      "https://www.cifraclub.com.br/guilherme-arantes/",
      "https://www.cifraclub.com.br/gilsons/",
      "https://www.cifraclub.com.br/gino-e-geno/",
      "https://www.cifraclub.com.br/gilberto-gil/",
      "https://www.cifraclub.com.br/gian-e-giovanni/",
      "https://www.cifraclub.com.br/grupo-menos-e-mais/",
      "https://www.cifraclub.com.br/henrique-e-juliano/",
      "https://www.cifraclub.com.br/humberto-gessinger/",
      "https://www.cifraclub.com.br/harmonia-do-samba/",
      "https://www.cifraclub.com.br/hungria-hip-hop/",
      "https://www.cifraclub.com.br/ivete-sangalo/",
      "https://www.cifraclub.com.br/ivyson/",
      "https://www.cifraclub.com.br/ira/",
      "https://www.cifraclub.com.br/ivan-lins/",
      "https://www.cifraclub.com.br/iza/",
      "https://www.cifraclub.com.br/jota-quest/",
      "https://www.cifraclub.com.br/jorge-vercillo/",
      "https://www.cifraclub.com.br/jorge-ben-jor/",
      "https://www.cifraclub.com.br/joao-bosco-viniciusacustico/",
      "https://www.cifraclub.com.br/jao/",
      "https://www.cifraclub.com.br/joao-gomes/",
      "https://www.cifraclub.com.br/jorge-aragao/",
      "https://www.cifraclub.com.br/jorge-mateus/",
      "https://www.cifraclub.com.br/katinguele/",
      "https://www.cifraclub.com.br/klb/",
      "https://www.cifraclub.com.br/kid-abelha/",
      "https://www.cifraclub.com.br/legiao-urbana/",
      "https://www.cifraclub.com.br/luiz-gonzaga/",
      "https://www.cifraclub.com.br/lulu-santos/",
      "https://www.cifraclub.com.br/leandro-e-leonardo/",
      "https://www.cifraclub.com.br/luan-santana/",
      "https://www.cifraclub.com.br/los-hermanos/",
      "https://www.cifraclub.com.br/leonardo/",
      "https://www.cifraclub.com.br/lagum/",
      "https://www.cifraclub.com.br/ls-jack/",
      "https://www.cifraclub.com.br/milionario-e-jose-rico/",
      "https://www.cifraclub.com.br/mamonas-assassinas/",
      "https://www.cifraclub.com.br/maiara-maraisa/",
      "https://www.cifraclub.com.br/martinho-da-vila/",
      "https://www.cifraclub.com.br/melim/",
      "https://www.cifraclub.com.br/marcos-belutti/",
      "https://www.cifraclub.com.br/marisa-monte/",
      "https://www.cifraclub.com.br/marilia-mendonca/",
      "https://www.cifraclub.com.br/matheus-kauan/",
      "https://www.cifraclub.com.br/milton-nascimento/",
      "https://www.cifraclub.com.br/maneva/",
      "https://www.cifraclub.com.br/maria-bethania/",
      "https://www.cifraclub.com.br/natiruts/",
      "https://www.cifraclub.com.br/nando-reis/",
      "https://www.cifraclub.com.br/ney-matogrosso/",
      "https://www.cifraclub.com.br/nelson-cavaquinho/",
      "https://www.cifraclub.com.br/netinho/",
      "https://www.cifraclub.com.br/os-novos-baianos/",
      "https://www.cifraclub.com.br/nenhum-de-nos/",
      "https://www.cifraclub.com.br/nelson-goncalves/",
      "https://www.cifraclub.com.br/nx-zero/",
      "https://www.cifraclub.com.br/negritude-junior/",
      "https://www.cifraclub.com.br/os-paralamas-do-sucesso/",
      "https://www.cifraclub.com.br/onze20/",
      "https://www.cifraclub.com.br/o-terno/",
      "https://www.cifraclub.com.br/os-travessos/",
      "https://www.cifraclub.com.br/olodum/",
      "https://www.cifraclub.com.br/oswaldo-montenegro/",
      "https://www.cifraclub.com.br/mutantes/",
      "https://www.cifraclub.com.br/o-teatro-magico/",
      "https://www.cifraclub.com.br/oriente/",
      "https://www.cifraclub.com.br/o-rappa/",
      "https://www.cifraclub.com.br/os-baroes-da-pisadinha/",
      "https://www.cifraclub.com.br/os-garotin/",
      "https://www.cifraclub.com.br/odair-jose/",
      "https://www.cifraclub.com.br/pineapple/",
      "https://www.cifraclub.com.br/paulinho-moska/",
      "https://www.cifraclub.com.br/pitty/",
      "https://www.cifraclub.com.br/pericles/",
      "https://www.cifraclub.com.br/pixote/",
      "https://www.cifraclub.com.br/pollo/",
      "https://www.cifraclub.com.br/planta-e-raiz/",
      "https://www.cifraclub.com.br/paula-fernandes/",
      "https://www.cifraclub.com.br/papas-na-lingua/",
      "https://www.cifraclub.com.br/raul-seixas/",
      "https://www.cifraclub.com.br/raca-negra/",
      "https://www.cifraclub.com.br/rita-lee/",
      "https://www.cifraclub.com.br/raimundos/",
      "https://www.cifraclub.com.br/renato-russo/",
      "https://www.cifraclub.com.br/rubel/",
      "https://www.cifraclub.com.br/reginaldo-rossi/",
      "https://www.cifraclub.com.br/rick-e-renner/",
      "https://www.cifraclub.com.br/roupa-nova/",
      "https://www.cifraclub.com.br/roberto-carlos/",
      "https://www.cifraclub.com.br/rio-negro-e-solimoes/",
      "https://www.cifraclub.com.br/rpm/",
      "https://www.cifraclub.com.br/restart/",
      "https://www.cifraclub.com.br/skank/",
      "https://www.cifraclub.com.br/so-pra-contrariar/",
      "https://www.cifraclub.com.br/sorriso-maroto/",
      "https://www.cifraclub.com.br/system-of-a-down/",
      "https://www.cifraclub.com.br/seu-jorge/",
      "https://www.cifraclub.com.br/sandy-e-junior-musicas/",
      "https://www.cifraclub.com.br/soweto/",
      "https://www.cifraclub.com.br/simone-simaria-as-coleguinhas/",
      "https://www.cifraclub.com.br/secos-molhados/",
      "https://www.cifraclub.com.br/titas/",
      "https://www.cifraclub.com.br/thiaguinho/",
      "https://www.cifraclub.com.br/tiago-iorc/",
      "https://www.cifraclub.com.br/toquinho/",
      "https://www.cifraclub.com.br/tribalistas/",
      "https://www.cifraclub.com.br/tim-maia/",
      "https://www.cifraclub.com.br/tom-jobim/",
      "https://www.cifraclub.com.br/tim-bernardes/",
      "https://www.cifraclub.com.br/tonico-e-tinoco/",
      "https://www.cifraclub.com.br/turma-do-pagode/",
      "https://www.cifraclub.com.br/um44k/",
      "https://www.cifraclub.com.br/ultraje-a-rigor/",
      "https://www.cifraclub.com.br/victor-leo/",
      "https://www.cifraclub.com.br/ventania/",
      "https://www.cifraclub.com.br/vanessa-da-mata/",
      "https://www.cifraclub.com.br/vitor-kley/",
      "https://www.cifraclub.com.br/vinicius-de-moraes/",
      "https://www.cifraclub.com.br/walmir-alencar/",
      "https://www.cifraclub.com.br/wesley-safadao/",
      "https://www.cifraclub.com.br/whindersson-nunes/",
      "https://www.cifraclub.com.br/mc-xama/",
      "https://www.cifraclub.com.br/xande-de-pilares/",
      "https://www.cifraclub.com.br/xuxa/",
      "https://www.cifraclub.com.br/zeze-di-camargo-e-luciano/",
      "https://www.cifraclub.com.br/zeca-pagodinho/",
      "https://www.cifraclub.com.br/zimbra/",
      "https://www.cifraclub.com.br/zizi-possi/",
      "https://www.cifraclub.com.br/zeca-baleiro/",
      "https://www.cifraclub.com.br/ze-ramalho/",
      "https://www.cifraclub.com.br/zelia-duncan/",
      "https://www.cifraclub.com.br/zelda/",
      "https://www.cifraclub.com.br/1kilo/",
      "https://www.cifraclub.com.br/14-bis/",
      "https://www.cifraclub.com.br/5-seco/",
      "https://www.cifraclub.com.br/3030/"
    ]

    require "nokogiri"
    require "open-uri"

    puts "Starting scrape of #{artist_urls.length} Brazilian artists"
    puts "Will scrape the top 15 songs from each artist"
    puts "=" * 80

    total_artists_processed = 0
    total_tabs_scraped = 0
    failed_artists = []

    artist_urls.each_with_index do |artist_url, artist_index|
      artist_name = artist_url.split("/")[-2]
      puts "\n[#{artist_index + 1}/#{artist_urls.length}] Processing artist: #{artist_name}"
      puts "URL: #{artist_url}"

      begin
        # Fetch and parse the artist page
        html = URI.open(artist_url, "User-Agent" => "Mozilla/5.0 (compatible; CifraClub Scraper)").read
        doc = Nokogiri::HTML(html)

        # Extract song URLs from the popular songs section
        song_links = []

        # Look for links that are likely song pages
        doc.css("a[href]").each do |link|
          href = link["href"]
          next unless href

          # Skip external links, anchor links, and non-song links
          next if href.start_with?("http") && !href.include?("cifraclub.com.br")
          next if href.start_with?("#")
          next if href.include?("/tab") || href.include?("/artist") || href.include?("/musico")
          next if href.include?("/album") || href.include?("/playlist")

          # Clean up the href
          clean_href = href.split(/[?#]/).first

          # Look for URLs with exactly 2 path segments (artist/song)
          path_parts = clean_href.split("/").reject(&:empty?)
          if path_parts.length == 2 && path_parts[0] != "tab" && path_parts[0] != "artist"
            # Make sure it's not the current artist page
            artist_path = artist_url.sub("https://www.cifraclub.com.br", "").chomp("/")
            next if clean_href == artist_path

            full_url = clean_href.start_with?("http") ? clean_href : "https://www.cifraclub.com.br#{clean_href}"
            song_links << full_url unless song_links.include?(full_url)
          end
        end

        # Filter to only include URLs for this artist
        song_links.select! do |url|
          url.include?("/#{artist_name}/") &&
          !url.include?("/musicas.html") &&
          !url.include?("/albuns.html") &&
          !url.include?("/discografia.html") &&
          !url.include?("/videoaulas.html") &&
          url.end_with?("/")
        end

        # Remove duplicates and limit to 15 most popular songs
        song_links = song_links.uniq.first(15)

        puts "  Found #{song_links.length} popular songs"

        if song_links.empty?
          puts "  ⚠ No song URLs found for this artist, skipping"
          failed_artists << { artist: artist_name, reason: "No songs found" }
          next
        end

        artist_tabs = 0
        song_links.each_with_index do |song_url, song_index|
          puts "  [#{song_index + 1}/#{song_links.length}] Scraping: #{song_url.split("/")[-2]}"

          begin
            tabs = CifraClub::PageScraper.import_all_versions!(song_url)
            artist_tabs += tabs.length
            total_tabs_scraped += tabs.length

            puts "    ✓ Scraped #{tabs.length} version(s)"
          rescue CifraClub::PageScraper::SkippedError => e
            puts "    • Skipped: #{e.message}"
          rescue => e
            puts "    ✗ Failed: #{e.message}"
          end

          # Small delay to be respectful to the server
          sleep(1) if song_index < song_links.length - 1
        end

        total_artists_processed += 1
        puts "  ✓ Completed artist: #{artist_name} (#{artist_tabs} tabs)"

        # Longer delay between artists
        sleep(2) if artist_index < artist_urls.length - 1

      rescue => e
        puts "  ✗ Failed to process artist: #{e.message}"
        failed_artists << { artist: artist_name, reason: e.message }
      end
    end

    # Summary
    puts "\n" + "=" * 80
    puts "SCRAPING SUMMARY"
    puts "=" * 80
    puts "Total artists processed: #{total_artists_processed}/#{artist_urls.length}"
    puts "Total tabs scraped: #{total_tabs_scraped}"

    if failed_artists.any?
      puts "\nFailed artists (#{failed_artists.length}):"
      failed_artists.each do |failure|
        puts "  - #{failure[:artist]}: #{failure[:reason]}"
      end
    else
      puts "\n✓ All artists processed successfully!"
    end
  end

  desc "Scrape the 15 most popular songs from a Cifra Club artist page"
  task :scrape_artist, [ :url ] => :environment do |t, args|
    unless args[:url]
      puts "Usage: rake cifra_club:scrape_artist_popular[url]"
      puts "Example: rake cifra_club:scrape_artist_popular['https://www.cifraclub.com.br/linkin-park/']"
      puts "This will scrape the 15 most popular songs from the artist page"
      exit 1
    end

    require "nokogiri"
    require "open-uri"

    artist_url = args[:url]
    puts "Scraping popular songs from Cifra Club artist: #{artist_url}"

    begin
      # Fetch and parse the artist page
      html = URI.open(artist_url, "User-Agent" => "Mozilla/5.0 (compatible; CifraClub Scraper)").read
      doc = Nokogiri::HTML(html)

      # Extract song URLs from the popular songs section
      song_links = []

      # Look for links that are likely song pages
      # Song URLs follow the pattern /artist/song/
      doc.css("a[href]").each do |link|
        href = link["href"]
        next unless href

        # Skip external links, anchor links, and non-song links
        next if href.start_with?("http") && !href.include?("cifraclub.com.br")
        next if href.start_with?("#")
        next if href.include?("/tab") || href.include?("/artist") || href.include?("/musico")
        next if href.include?("/album") || href.include?("/playlist")

        # Clean up the href
        clean_href = href.split(/[?#]/).first

        # Look for URLs with exactly 2 path segments (artist/song)
        path_parts = clean_href.split("/").reject(&:empty?)
        if path_parts.length == 2 && path_parts[0] != "tab" && path_parts[0] != "artist"
          # Make sure it's not the current artist page
          artist_path = artist_url.sub("https://www.cifraclub.com.br", "").chomp("/")
          next if clean_href == artist_path

          full_url = clean_href.start_with?("http") ? clean_href : "https://www.cifraclub.com.br#{clean_href}"
          song_links << full_url unless song_links.include?(full_url)
        end
      end

      # Filter to only include URLs that look like valid song pages
      # (contain the artist name in the path and are actual song pages)
      artist_name = artist_url.split("/")[-2] # Extract artist name from URL
      song_links.select! do |url|
        url.include?("/#{artist_name}/") &&
        !url.include?("/musicas.html") &&
        !url.include?("/albuns.html") &&
        !url.include?("/discografia.html") &&
        !url.include?("/videoaulas.html") &&
        url.end_with?("/") # Song URLs end with /
      end

      # Remove duplicates and limit to 15 most popular songs
      song_links = song_links.uniq.first(15)

      puts "Found #{song_links.length} popular song URLs:"
      song_links.each { |url| puts "  #{url}" }

      if song_links.empty?
        puts "No song URLs found on the artist page"
        exit 1
      end

      total_tabs = 0
      song_links.each_with_index do |song_url, index|
        puts "\n[#{index + 1}/#{song_links.length}] Scraping: #{song_url}"

        begin
          tabs = CifraClub::PageScraper.import_all_versions!(song_url)
          total_tabs += tabs.length

          puts "  ✓ Scraped #{tabs.length} tabs:"
          tabs.each do |tab|
            version = tab.version_name.presence || "principal"
            puts "    - #{tab.song_title} (#{tab.instrument}, #{version})"
          end
        rescue CifraClub::PageScraper::SkippedError => e
          puts "  • Skipped: #{e.message}"
        rescue => e
          puts "  ✗ Failed: #{e.message}"
        end

        # Small delay to be respectful to the server
        sleep(1) if index < song_links.length - 1
      end

      puts "\n✓ Successfully scraped #{total_tabs} tabs from #{song_links.length} popular songs"

    rescue => e
      puts "✗ Failed to scrape artist page: #{e.message}"
      puts e.backtrace.join("\n") if ENV["DEBUG"]
      exit 1
    end
  end
end
