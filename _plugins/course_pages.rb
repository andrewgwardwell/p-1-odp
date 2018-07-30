# frozen_string_literal: true

module CoursePages
  class Generator < Jekyll::Generator
    safe true

    def generate(site)
      sightings = site.collections['sightings'].docs
      # principles = sightings.map{|doc| doc['principle']}.uniq.map {|s| slugify(s)}
      # TODO check that these are present in site.collections['principles']

      coll = site.collections['courses'] ||= Jekyll::Collection.new(site, 'courses')
      courses = sightings.map { |doc| doc['course-number'] }.compact.uniq
      courses.each do |course_number|
        slug = Jekyll::Utils.slugify course_number
        doc = Jekyll::Document.new("_courses/#{slug}.md",
                                   site: site,
                                   collection: coll)
        doc.content = ''
        doc.data['course-number'] = course_number
        doc.data['path'] = "_courses/#{slug}"
        doc.data['title'] = course_number
        coll.docs << doc
      end
    end
  end
end

# def slugify(string)
#   Jekyll::Utils.slugify(string)
# end
