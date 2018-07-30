# frozen_string_literal: true

module CoursePages
  class Generator < Jekyll::Generator
    attr_reader :site
    attr_reader :sightings

    def generate(site)
      @site = site
      @sightings = site.collections['sightings'].docs
      check_principles!
      add_frontmatter!
      create_course_pages!
      create_instructor_pages!
    end

    private

    def intern_collection!(name)
      site.collections[name] ||= Jekyll::Collection.new(site, name)
    end

    def check_principles!
      # principles = sightings.map{|doc| doc['principle']}.uniq.map {|s| slugify(s)}
      # TODO check that these are present in site.collections['principles']
    end

    def add_frontmatter!
      site.collections['principles'].docs.each do |doc|
        doc.data['principle'] ||= doc.data['title']
      end
    end

    def create_course_pages!
      coll = intern_collection! 'courses'
      course_numbers = sightings.map { |doc| doc['course-number'] }.compact.uniq
      course_numbers.each do |course_number|
        slug = Jekyll::Utils.slugify course_number
        doc = Jekyll::Document.new("_courses/#{slug}.md",
                                   site: site,
                                   collection: coll)
        doc.data['course-number'] = course_number
        doc.data['title'] = course_number
        coll.docs << doc
      end
    end

    def create_instructor_pages!
      coll = intern_collection! 'instructors'
      instructors = sightings.map do |doc|
        [doc['course-instructor']] + (doc['course-instructors'] || [])
      end.flatten.compact.uniq
      instructors.each do |instructor|
        slug = Jekyll::Utils.slugify instructor.sub(/, Ph\.\s*D\.$/, '')
        doc = Jekyll::Document.new("_instructors/#{slug}.md",
                                   site: site,
                                   collection: coll)
        doc.data['title'] = instructor
        coll.docs << doc
      end
    end
  end

  module LiquidFilters
    def shares_instructor(doc1, doc2)
      instructors1 = ([doc1['course-instructor']] + (doc1['course-instructors'] || [])).compact
      instructors2 = ([doc2['course-instructor']] + (doc2['course-instructors'] || [])).compact
      !(instructors1 & instructors2).empty?
    end
  end
end

Liquid::Template.register_filter(CoursePages::LiquidFilters)
