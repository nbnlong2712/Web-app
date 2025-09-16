# 5) Supabase query (example)
```sql
select * from tools
where (
  (coalesce(:primary_tag,'') = '' or primary_tag = :primary_tag)
  and (:pricing is null or pricing = :pricing)
  and (:no_signup is null or no_signup = :no_signup)
  and (:platform is null or platform = :platform)
  and (:language is null or :language = ANY(language))
)
and (
  to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery('simple', :q)
  or (:q = '' and true)
  or (:tags_cnt > 0 and tags && :tags)
)
order by (case when primary_tag = :primary_tag then 0 else 1 end),
         similarity(name, :q) desc
limit 24;
```
