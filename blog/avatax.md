---
layout: page
title: AvaTax Posts
blog_breadcrumb: 1
nav: resources
---

<ul>
 {% for post in site.posts %}
     {% if post.categories contains AvaTax %}
     <div class="col-md-4">
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
    {% endif %}
    {% endfor %}
     
</ul>