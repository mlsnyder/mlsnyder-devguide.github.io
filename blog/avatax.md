---
layout: page
title: AvaTax Posts
blog_breadcrumb: 1
nav: resources
---
<!-- this lists all the categories with all the posts within that category underneath it -->
<!--
{% for category in site.categories %}
  <li><a name="{{ category | first }}">{{ category | first }}</a>
    
  </li>
{% endfor %}  -->
{% assign category = 'sdk' %}
<ul>
    {% for posts in category %}
      {% for post in posts %}
        <li><a href="{{ post.url }}">{{ post.title }}</a></li>
      {% endfor %}
    {% endfor %} 
    </ul>

<!--
<p>Posts in category "basic" are:</p> 
<ul>
    {% if post.url %} 
    
     <div class="row">       
            <div class="col-md-4"> 
            {% for post in site.categories.api %}
                <div class="blog-preview">
                    <div class="gradient"></div>
                    <h4><a href="{{ post.url }}">{{ post.title }}</a></h4>
                    <h5>{{ post.subtitle }}</h5>
                    <p class="byline">By {{post.author}} | {{ post.date | date: "%B %d, %Y"}}</p>
                    {% if post.imgsrc %}<p><img src="{{ post.imgsrc }}" class="blog-preview-image" alt="blog preview image"/></p>{% endif %}
                    <p class="blog-excerpt">{{ post.excerpt | strip_html | truncatewords: 100 }}</p>
                    <div class="readMore">
                        <a href="{{ post.url }}" class="btn btn-blog">Read More</a>
                    </div>
                </div>
          </div>
           
        </div> 
        {% endfor %} 
     {% endif %} 
</ul>

<ul class="blog-pagination">
    {% if paginator.previous_page %}
    <li><a href="{{ paginator.previous_page_path }}" class="previous">Newer</a></li>
    {% else %}
    <li class="previous">Newer</li>
    {% endif %}
    <li class="page_number">Page {{ paginator.page }} of {{ paginator.total_pages }}</li>
    {% if paginator.next_page %}
    <li><a href="{{ paginator.next_page_path }}" class="next">Older</a></li>
    {% else %}
    <li class="next">Older</li>
    {% endif %}
</ul>
-->