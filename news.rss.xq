<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{$fileinfo/title/node()} - BeniBela online</title>
    <link>http://www.benibela.de</link>
    <description>BeniBela online</description>
    <language>{$language/id/data()}</language>
    <atom:link href="http://www.benibela.de/index_{$language/id}.rss" rel="self" type="application/rss+xml" />
    
    {subsequence($file/news/new,1,10) ! (let $serialized :=  join(text/node()/outer-html()) return
    <item>
      <title>{if (text/@language != $language/id ) then 
         $language/nottranslated/data()
        else
         substring( join(text/node()/data()), 1, 80 ) || ".."}</title>
      <description>{$serialized}</description>
      <link>http://www.benibela.de/index_{$language/id/data()}.html#new{@date/data()}</link>
      <pubDate>{format-date(xs:date(@date/data()), "[D00] [MNn,3-3] [Y0000]")} 10:00:00 GMT</pubDate>
    </item>)
    }
  </channel>
</rss>
